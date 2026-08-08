export type RsvpStatus = 'confirmed' | 'pending' | 'declined' | 'maybe' | 'checked_in';
export type QrStatus = 'none' | 'ready' | 'expired' | 'used';

export interface Guest {
  id: string;
  name: string;
  phone: string;
  status: RsvpStatus;
  table?: string;
  companions: number;
  isVip?: boolean;
  category: 'family' | 'friends' | 'colleagues' | 'other';
  lastInteraction?: string;
  qrCode: string;
  qrStatus: QrStatus;
  notes?: string;
}
