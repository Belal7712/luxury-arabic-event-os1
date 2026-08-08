const fs = require('fs');

const names = [
  'سليمان العبدالله', 'عبدالرحمن الدوسري', 'محمد القحطاني', 'فهد المطيري', 'عمر الشمري',
  'فيصل الغامدي', 'خالد الحربي', 'سعود العتيبي', 'تركي السبيعي', 'نواف الزهراني',
  'عبدالعزيز الشهراني', 'سلطان العنزي', 'وليد الجوهري', 'بندر الشريف', 'ماجد العبيد',
  'أحمد اليامي', 'ياسر المري', 'صالح التميمي', 'عبدالله الحارثي', 'راكان السالم',
  'فراس المالكي', 'سامي الخالدي', 'نايف الشعلان', 'طارق البقمي', 'بدر القاسم',
  'عبدالمجيد الصيعري', 'يزيد العجمي', 'سعد السديري', 'منصور النصار', 'ريان الهذلي'
];

const categories = ['family', 'friends', 'colleagues', 'other'];
const statuses = ['confirmed', 'pending', 'declined', 'maybe', 'checked_in'];
const qrStatuses = ['none', 'ready', 'expired', 'used'];
const tables = ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'VIP1', 'VIP2', undefined, undefined, undefined];
const times = ['منذ ساعتين', 'منذ يومين', 'أمس', 'منذ ٣ ساعات', 'اليوم', undefined, undefined];

const guests = names.map((name, index) => {
  const id = `G-${1001 + index}`;
  const phone = `+966 5${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`;
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const isVip = Math.random() > 0.8;
  const table = isVip ? (Math.random() > 0.5 ? 'VIP1' : 'VIP2') : tables[Math.floor(Math.random() * tables.length)];
  const companions = Math.floor(Math.random() * 5);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const lastInteraction = times[Math.floor(Math.random() * times.length)];
  const qrStatus = qrStatuses[Math.floor(Math.random() * qrStatuses.length)];
  
  return {
    id,
    name,
    phone,
    status,
    table,
    companions,
    isVip,
    category,
    lastInteraction,
    qrCode: `QR-${1001 + index}`,
    qrStatus,
    notes: Math.random() > 0.8 ? 'ملاحظة تجريبية للضيف' : undefined,
  };
});

const content = `import { Guest } from './types';

export const mockGuests: Guest[] = ${JSON.stringify(guests, null, 2)};
`;

fs.writeFileSync('src/components/workspace/guests/mockData.ts', content);
