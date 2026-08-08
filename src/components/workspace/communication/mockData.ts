import {
  Campaign,
  CommunicationDraft,
  FailedRecipient,
  MessageTemplate,
  ResolvedRecipient,
} from './types';

/**
 * Realistic Arabic Wedding Message Templates
 */
export const mockTemplates: MessageTemplate[] = [
  {
    id: 'tpl-01',
    title: 'دعوة الزفاف الرسمية',
    intent: 'invitation',
    description: 'دعوة راقية تتضمن اسم الضيف ورابط بطاقة الدعوة التفاعلية',
    recommendedAudience: 'all',
    content:
      'نرحب بكم أجمل ترحيب في حفل زفافنا الميمون.\nيسرنا حضوركم ومشاركتنا فرحتنا اليوم.\n\nالضيف العزيز: {{guest_name}}\nبطاقة الدعوة الخاصة بكم:\n{{invitation_link}}',
    variables: ['guest_name', 'invitation_link'],
    attachments: { includeCard: true },
    source: 'system',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'tpl-02',
    title: 'تذكير قبل المناسبة',
    intent: 'reminder',
    description: 'تذكير ودود يقدم تفاصيل الموعد والموقع والجداول',
    recommendedAudience: 'confirmed',
    content:
      'نذكركم بموعد حفل الزفاف غداً في تمام الساعة {{event_time}}.\nالموقع: {{venue}}\n\nنتطلع لرؤيتكم واكتملت فرحتنا بحضوركم.\nرابط الخريطة:\n{{location_link}}',
    variables: ['guest_name', 'event_time', 'venue', 'location_link'],
    attachments: { includeLocation: true },
    source: 'system',
    createdAt: '2026-08-02T12:00:00Z',
    updatedAt: '2026-08-02T12:00:00Z',
  },
  {
    id: 'tpl-03',
    title: 'طلب تأكيد الحضور (RSVP)',
    intent: 'rsvp_confirmation',
    description: 'رسالة سريعة لتأكيد حضور الضيف وعدد المرافقين',
    recommendedAudience: 'pending',
    content:
      'عزيزنا {{guest_name}}، يسعدنا تواصلكم وتأكيد حضوركم لحفل الزفاف لتجهيز ترتيبات الجلوس الخاصة بكم.\n\nيرجى تأكيد الحضور من خلال الرابط التالي:\n{{rsvp_link}}',
    variables: ['guest_name', 'rsvp_link'],
    source: 'system',
    createdAt: '2026-08-03T14:30:00Z',
    updatedAt: '2026-08-03T14:30:00Z',
  },
  {
    id: 'tpl-04',
    title: 'رمز الدخول السريع (QR Code)',
    intent: 'qr_code',
    description: 'إرسال رمز QR الخاص بالاستقبال للدخول السريع دون انتظار',
    recommendedAudience: 'confirmed',
    content:
      'أهلاً بك {{guest_name}}.\nلتسهيل دخولكم القاعة، يرجى إبراز رمز الدخول عند بوابة الاستقبال.\nرقم الطاولة: {{table_number}}\n\nرابط رمز QR:\n{{qr_link}}',
    variables: ['guest_name', 'table_number', 'qr_link'],
    attachments: { includeQr: true },
    source: 'system',
    createdAt: '2026-08-04T09:15:00Z',
    updatedAt: '2026-08-04T09:15:00Z',
  },
  {
    id: 'tpl-05',
    title: 'موقع القاعة والتوجيهات',
    intent: 'location',
    description: 'توجيهات الوصول للموقع والباركينج المخصص',
    recommendedAudience: 'confirmed',
    content:
      'موقع حفل الزفاف: {{venue}}\nيتوفر مواقف خاصة لخدمة صف السيارات (Valet Parking).\n\nرابط الوصول المباشر عبر الخريطة:\n{{location_link}}',
    variables: ['venue', 'location_link'],
    attachments: { includeLocation: true },
    source: 'system',
    createdAt: '2026-08-05T16:00:00Z',
    updatedAt: '2026-08-05T16:00:00Z',
  },
  {
    id: 'tpl-06',
    title: 'رسالة شكر وامتنان',
    intent: 'thank_you',
    description: 'رسالة شكر وتقدير للضيوف بعد ختام الحفل',
    recommendedAudience: 'confirmed',
    content:
      'أنار حضوركم حفلنا وزادنا شرفاً وفرحاً.\nشكراً لك {{guest_name}} على مشاركتنا أجمل لحظات العمر.\nدامت دياركم بالمسرات.',
    variables: ['guest_name'],
    source: 'system',
    createdAt: '2026-08-06T20:00:00Z',
    updatedAt: '2026-08-06T20:00:00Z',
  },
  {
    id: 'tpl-07',
    title: 'رسالة مخصصة (نظام)',
    intent: 'custom',
    description: 'قالب فارغ لرسالة مخصصة',
    recommendedAudience: 'all',
    content: '',
    variables: [],
    source: 'system',
    createdAt: '2026-08-06T20:00:00Z',
    updatedAt: '2026-08-06T20:00:00Z',
  },
];

/**
 * Realistic Resolved Recipients matching Wedding Guest List
 */
export const mockResolvedRecipients: ResolvedRecipient[] = [
  {
    id: 'G-1001',
    name: 'سليمان العبدالله',
    phone: '+966 57 618 4007',
    status: 'confirmed',
    tableNumber: 'VIP2',
    isVip: true,
    companions: 3,
    category: 'family',
  },
  {
    id: 'G-1002',
    name: 'عبدالرحمن الدوسري',
    phone: '+966 52 606 5494',
    status: 'checked_in',
    tableNumber: 'C2',
    isVip: false,
    companions: 0,
    category: 'colleagues',
  },
  {
    id: 'G-1003',
    name: 'محمد القحطاني',
    phone: '+966 50 490 5953',
    status: 'checked_in',
    tableNumber: 'C1',
    isVip: false,
    companions: 2,
    category: 'friends',
  },
  {
    id: 'G-1004',
    name: 'فهد المطيري',
    phone: '+966 53 341 9248',
    status: 'confirmed',
    tableNumber: 'B1',
    isVip: false,
    companions: 3,
    category: 'friends',
  },
  {
    id: 'G-1005',
    name: 'عمر الشمري',
    phone: '+966 57 304 9645',
    status: 'pending',
    tableNumber: 'VIP1',
    isVip: true,
    companions: 0,
    category: 'vip',
  },
  {
    id: 'G-1006',
    name: 'خالد السبيعي',
    phone: '+966 55 123 9876',
    status: 'declined',
    isVip: false,
    companions: 0,
    category: 'colleagues',
  },
  {
    id: 'G-1007',
    name: 'عبدالمجيد الغامدي',
    phone: '+966 54 987 6543',
    status: 'pending',
    tableNumber: 'A3',
    isVip: false,
    companions: 1,
    category: 'friends',
  },
  {
    id: 'G-1008',
    name: 'سعود الشهري',
    phone: '+966 56 444 3322',
    status: 'confirmed',
    tableNumber: 'VIP2',
    isVip: true,
    companions: 2,
    category: 'family',
  },
];

/**
 * Realistic Historic Campaigns
 */
export const mockCampaigns: Campaign[] = [
  {
    id: 'cmp-001',
    title: 'إرسال دعوات حفل الزفاف الرئيسية',
    intent: 'invitation',
    audience: { preset: 'all' },
    message: {
      intent: 'invitation',
      templateId: 'tpl-01',
      content:
        'نرحب بكم أجمل ترحيب في حفل زفافنا الميمون.\nالضيف العزيز: {{guest_name}}\nبطاقة الدعوة:\n{{invitation_link}}',
      variables: {
        invitation_link: 'https://event.sa/inv/G-1001',
      },
      attachments: { includeCard: true },
    },
    status: 'completed',
    sentAt: '2026-08-05T18:30:00Z',
    stats: {
      total: 184,
      queued: 0,
      sending: 0,
      sent: 184,
      delivered: 176,
      read: 158,
      failed: 8,
    },
    createdAt: '2026-08-05T18:00:00Z',
    updatedAt: '2026-08-05T18:30:00Z',
  },
  {
    id: 'cmp-002',
    title: 'تذكير الضيوف غير المكدين (RSVP)',
    intent: 'rsvp_confirmation',
    audience: { preset: 'pending' },
    message: {
      intent: 'rsvp_confirmation',
      templateId: 'tpl-03',
      content:
        'عزيزنا {{guest_name}}، نرجو تأكيد حضوركم لحفل الزفاف لتسهيل تنظيم المقاعد.',
      variables: {},
    },
    status: 'completed',
    sentAt: '2026-08-06T12:00:00Z',
    stats: {
      total: 42,
      queued: 0,
      sending: 0,
      sent: 42,
      delivered: 42,
      read: 38,
      failed: 0,
    },
    createdAt: '2026-08-06T11:45:00Z',
    updatedAt: '2026-08-06T12:00:00Z',
  },
  {
    id: 'cmp-003',
    title: 'إرسال رموز QR لطاولات كبار الشخصيات',
    intent: 'qr_code',
    audience: { preset: 'vip' },
    message: {
      intent: 'qr_code',
      templateId: 'tpl-04',
      content:
        'أهلاً بك {{guest_name}}.\nرمز دخول طاولات VIP جاهز للاستخدام عند الاستقبال.',
      variables: {},
      attachments: { includeQr: true },
    },
    status: 'scheduled',
    scheduledAt: '2026-08-08T15:00:00Z',
    stats: {
      total: 24,
      queued: 24,
      sending: 0,
      sent: 0,
      delivered: 0,
      read: 0,
      failed: 0,
    },
    createdAt: '2026-08-07T09:00:00Z',
    updatedAt: '2026-08-07T09:00:00Z',
  },
];

/**
 * Realistic Failed Recipients for Retry Workflow
 */
export const mockFailedRecipients: FailedRecipient[] = [
  {
    guestId: 'G-1012',
    name: 'عبدالله الحارثي',
    phone: '+966 50 111 2233',
    reason: 'رقم الواتساب غير مسجل أو مفصول',
    failedAt: '2026-08-05T18:32:10Z',
    canRetry: true,
  },
  {
    guestId: 'G-1015',
    name: 'تركي المالكي',
    phone: '+966 55 999 8877',
    reason: 'انتهت مهلة التسليم (Timeout)',
    failedAt: '2026-08-05T18:33:45Z',
    canRetry: true,
  },
  {
    guestId: 'G-1019',
    name: 'ماجد العتيبي',
    phone: '+966 54 333 2211',
    reason: 'حظر استلام الرسائل الترويجية',
    failedAt: '2026-08-05T18:35:00Z',
    canRetry: false,
  },
];

/**
 * Default Communication Draft
 */
export const mockInitialDraft: CommunicationDraft = {
  id: 'draft-active',
  title: 'مسودة حملة التواصل',
  audience: {
    preset: 'all',
  },
  intent: 'invitation',
  templateId: 'tpl-01',
  content:
    'نرحب بكم أجمل ترحيب في حفل زفافنا الميمون.\nيسرنا حضوركم ومشاركتنا فرحتنا اليوم.\n\nالضيف العزيز: {{guest_name}}\nبطاقة الدعوة الخاصة بكم:\n{{invitation_link}}',
  attachments: {
    includeCard: true,
    includeLocation: true,
  },
  updatedAt: new Date().toISOString(),
};
