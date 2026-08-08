/**
 * PHASE 6 — EVENT COMMUNICATION & WHATSAPP ENGINE
 * Domain Models & State Types
 */

export type MessageIntent =
  | 'invitation'
  | 'reminder'
  | 'rsvp_confirmation'
  | 'location'
  | 'qr_code'
  | 'thank_you'
  | 'custom';

export type AudiencePreset =
  | 'all'
  | 'confirmed'
  | 'pending'
  | 'declined'
  | 'vip'
  | 'family'
  | 'friends'
  | 'men'
  | 'women'
  | 'table'
  | 'manual';

export interface AudienceConfig {
  preset: AudiencePreset;
  selectedTableId?: string;
  selectedGuestIds?: string[];
  excludedGuestIds?: string[];
  genderFilter?: 'men' | 'women';
  categoryFilter?: string;
  customFilters?: {
    rsvpStatus?: 'confirmed' | 'pending' | 'declined' | 'maybe' | 'checked_in';
    isVipOnly?: boolean;
  };
}

export interface MessageAttachments {
  includeQr?: boolean;
  includeLocation?: boolean;
  includeCard?: boolean;
}

export interface MessageConfig {
  intent: MessageIntent;
  templateId?: string;
  content: string;
  variables: Record<string, string>;
  attachments?: MessageAttachments;
}

export interface DeliveryStats {
  total: number;
  queued: number;
  sending: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

export type CampaignStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'queued' 
  | 'sending' 
  | 'completed' 
  | 'partially_failed' 
  | 'failed' 
  | 'cancelled';

export interface Campaign {
  id: string;
  title: string;
  intent: MessageIntent;
  audience: AudienceConfig;
  message: MessageConfig;
  status: CampaignStatus;
  scheduledAt?: string;
  sentAt?: string;
  stats: DeliveryStats;
  createdAt: string;
  updatedAt: string;
  failedRecipients?: FailedRecipient[];
  recipients?: ResolvedRecipient[]; // Store the actual snapshot of recipients
}

export interface CommunicationDraft {
  id: string;
  title?: string;
  audience: AudienceConfig;
  intent: MessageIntent;
  templateId?: string;
  content: string;
  attachments?: MessageAttachments;
  updatedAt: string;
}

export interface CommunicationInitContext {
  initialAudiencePreset?: AudiencePreset;
  initialGuestIds?: string[];
  initialIntent?: MessageIntent;
  initialTemplateId?: string;
}

export interface ResolvedRecipient {
  id: string;
  name: string;
  phone: string;
  status: 'confirmed' | 'pending' | 'declined' | 'maybe' | 'checked_in';
  tableNumber?: string;
  isVip?: boolean;
  companions?: number;
  gender?: 'men' | 'women';
  category?: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  intent: MessageIntent;
  content: string;
  description: string;
  recommendedAudience?: AudiencePreset;
  variables: string[];
  attachments?: MessageAttachments;
  source: 'system' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface FailedRecipient {
  guestId: string;
  name: string;
  phone: string;
  reason: string;
  failedAt: string;
  canRetry: boolean;
}

export interface ProviderResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

export interface CommunicationProvider {
  name: string;
  isMock: boolean;
  sendBatch: (
    campaignId: string,
    recipients: ResolvedRecipient[],
    message: MessageConfig
  ) => Promise<ProviderResponse[]>;
}
