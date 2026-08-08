import { useState, useRef, useEffect } from 'react';
import { GuestHeader } from './GuestHeader';
import { GuestSearch } from './GuestSearch';
import { GuestList } from './GuestList';
import { mockGuests } from './mockData';
import { GuestEmptyState } from './GuestEmptyState';
import { GuestDetailsSheet } from './GuestDetailsSheet';
import { UndoToast } from './UndoToast';
import { BulkOperationsSheet } from './BulkOperationsSheet';
import { ImportExportSheet } from './ImportExportSheet';
import { WhatsAppSheet } from './WhatsAppSheet';
import { TableAssignmentSheet } from './TableAssignmentSheet';
import { Guest } from './types';
import { CommunicationWorkspace } from '../communication/CommunicationWorkspace';
import { CommunicationInitContext } from '../communication/types';

export function GuestWorkspace() {
  const [guests, setGuests] = useState<Guest[]>(mockGuests);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('الكل');
  
  // Communication State
  const [isCommOpen, setIsCommOpen] = useState(false);
  const [commContext, setCommContext] = useState<CommunicationInitContext>({ isOpen: false });

  // Selection State
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  // Sheet States
  const [showImportExport, setShowImportExport] = useState(false);
  const [showBulkWhatsApp, setShowBulkWhatsApp] = useState(false);
  const [showBulkTable, setShowBulkTable] = useState(false);
  
  useEffect(() => {
    const handleOpenComm = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { guestIds, audiencePreset, guestName } = customEvent.detail || {};
      
      let finalGuestIds = guestIds;
      
      // Resolve guest ID by name if needed (from GuestDetailsSheet)
      if (!finalGuestIds && guestName) {
        const foundGuest = guests.find(g => g.name === guestName);
        if (foundGuest) finalGuestIds = [foundGuest.id];
      }
      
      setCommContext({
        initialGuestIds: finalGuestIds,
        initialAudiencePreset: finalGuestIds && finalGuestIds.length > 0 ? 'manual' : audiencePreset
      });
      setIsCommOpen(true);
    };
    
    window.addEventListener('open-communication', handleOpenComm);
    return () => window.removeEventListener('open-communication', handleOpenComm);
  }, [guests]);

  
  // Undo State
  const [undoAction, setUndoAction] = useState<{ message: string; undoFn: () => void } | null>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout>();

  const showUndo = (message: string, undoFn?: () => void) => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    setUndoAction({ message, undoFn: undoFn || (() => {}) });
    undoTimeoutRef.current = setTimeout(() => {
      setUndoAction(null);
    }, 5000);
  };

  const handleUpdateGuest = (id: string, updates: Partial<Guest>) => {
    const previousGuests = [...guests];
    setGuests(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    
    if (updates.status || updates.category) {
      showUndo(`تم تحديث بيانات الضيف`, () => {
        setGuests(previousGuests);
      });
    }
  };

  const handleDeleteGuest = (id: string) => {
    const previousGuests = [...guests];
    const guestToDelete = guests.find(g => g.id === id);
    if (!guestToDelete) return;

    setGuests(prev => prev.filter(g => g.id !== id));
    showUndo(`تم حذف ${guestToDelete.name}`, () => {
      setGuests(previousGuests);
    });
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedGuestIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedGuestIds(newSelection);
    if (newSelection.size === 0) setIsSelectionMode(false);
  };

  const handleLongPress = (id: string) => {
    setIsSelectionMode(true);
    toggleSelection(id);
  };

  const resetSelection = () => {
    setIsSelectionMode(false);
    setSelectedGuestIds(new Set());
  };

  // Filter logic
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch = 
      guest.name.includes(searchQuery) || 
      guest.phone.includes(searchQuery) ||
      (guest.table && guest.table.includes(searchQuery));

    let matchesFilter = true;
    if (activeFilter === 'مؤكد') matchesFilter = guest.status === 'confirmed';
    if (activeFilter === 'بانتظار الرد') matchesFilter = guest.status === 'pending';
    if (activeFilter === 'معتذر') matchesFilter = guest.status === 'declined';
    if (activeFilter === 'VIP') matchesFilter = !!guest.isVip;

    return matchesSearch && matchesFilter;
  });

  const selectedGuest = guests.find(g => g.id === selectedGuestId) || null;

  return (
    <section className="flex flex-col gap-6 relative">
      <GuestHeader 
        totalGuests={guests.length}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedGuestIds.size}
        onCancelSelection={resetSelection}
        onSelectAll={() => {
          setSelectedGuestIds(new Set(filteredGuests.map(g => g.id)));
        }}
        onOpenOptions={() => setShowImportExport(true)}
      />
      
      {guests.length > 0 ? (
        <>
          {!isSelectionMode && (
            <GuestSearch 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          )}

          <GuestList 
            guests={filteredGuests} 
            onSelectGuest={(guest) => {
              if (isSelectionMode) {
                toggleSelection(guest.id);
              } else {
                setSelectedGuestId(guest.id);
              }
            }}
            isSelectionMode={isSelectionMode}
            selectedGuestIds={selectedGuestIds}
            onLongPress={handleLongPress}
            onUpdateGuest={handleUpdateGuest}
            onDeleteGuest={handleDeleteGuest}
          />
        </>
      ) : (
        <GuestEmptyState />
      )}

      {/* Detail Sheet */}
      <GuestDetailsSheet 
        guest={selectedGuest} 
        isOpen={!!selectedGuest} 
        onClose={() => setSelectedGuestId(null)} 
        onUpdate={(updates) => {
          if (selectedGuest) {
            handleUpdateGuest(selectedGuest.id, updates);
          }
        }}
      />

      {/* Bulk Operations Sheet */}
      <BulkOperationsSheet 
        isOpen={isSelectionMode && selectedGuestIds.size > 0}
        selectedCount={selectedGuestIds.size}
        onAction={(action) => {
          if (action === 'delete') {
            const previousGuests = [...guests];
            setGuests(prev => prev.filter(g => !selectedGuestIds.has(g.id)));
            showUndo(`تم حذف ${selectedGuestIds.size} ضيوف`, () => {
              setGuests(previousGuests);
            });
            resetSelection();
          } else if (action === 'confirm') {
            const previousGuests = [...guests];
            setGuests(prev => prev.map(g => selectedGuestIds.has(g.id) ? { ...g, status: 'confirmed' } : g));
            showUndo(`تم تحديث حالة ${selectedGuestIds.size} ضيوف`, () => {
              setGuests(previousGuests);
            });
            resetSelection();
          } else if (action === 'whatsapp') {
            setShowBulkWhatsApp(true);
          } else if (action === 'table') {
            setShowBulkTable(true);
          } else if (action === 'qr') {
            const previousGuests = [...guests];
            setGuests(prev => prev.map(g => selectedGuestIds.has(g.id) ? { ...g, qrStatus: 'ready' } : g));
            showUndo(`تم إنشاء QR لـ ${selectedGuestIds.size} ضيوف`, () => setGuests(previousGuests));
            resetSelection();
          } else if (action === 'export') {
            showUndo(`تم بدء تصدير ${selectedGuestIds.size} ضيوف...`);
            resetSelection();
          }
        }}
      />

      {/* Bulk WhatsApp Adapter */}
      <WhatsAppSheet 
        isOpen={showBulkWhatsApp}
        onClose={() => setShowBulkWhatsApp(false)}
        guestIds={Array.from(selectedGuestIds)}
      />

      {/* Singleton Communication Workspace */}
      <CommunicationWorkspace 
        isOpen={isCommOpen}
        onClose={() => setIsCommOpen(false)}
        initContext={commContext}
      />

      {/* Bulk Table */}
      <TableAssignmentSheet 
        isOpen={showBulkTable}
        onClose={() => setShowBulkTable(false)}
        onAssign={(table) => {
          const previousGuests = [...guests];
          setGuests(prev => prev.map(g => selectedGuestIds.has(g.id) ? { ...g, table } : g));
          showUndo(`تم تعيين ${selectedGuestIds.size} ضيوف للطاولة`, () => {
            setGuests(previousGuests);
          });
          resetSelection();
        }}
      />

      <ImportExportSheet 
        isOpen={showImportExport}
        onClose={() => setShowImportExport(false)}
      />

      {/* Undo Toast */}
      <UndoToast 
        message={undoAction?.message || ''}
        isVisible={!!undoAction}
        onUndo={() => {
          if (undoAction?.undoFn) undoAction.undoFn();
          setUndoAction(null);
        }}
        onClose={() => setUndoAction(null)}
      />
    </section>
  );
}
