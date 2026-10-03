/**
 * Sample transaction/history dataset for the Pharmacy Portal History tab.
 */

export type TransactionType =
  | 'dispensed'
  | 'purchased'
  | 'stock_added'
  | 'stock_adjusted'
  | 'return'
  | 'expired'
  | 'order';

export type TransactionStatus = 'completed' | 'pending' | 'cancelled' | 'returned' | 'expired';

export interface Transaction {
  id: string;
  medicineName: string;
  batch: string;
  quantity: number;
  unit: string;
  type: TransactionType;
  status: TransactionStatus;
  dateTime: string;
  dateGroup: 'Today' | 'Yesterday' | 'This Week' | 'Earlier';
  staff: string;
  patientName?: string;
  patientId?: string;
  prescriptionId?: string;
  supplier?: string;
  reference: string;
  amount: string;
  notes: string;
}

export const TYPE_LABELS: Record<TransactionType, string> = {
  dispensed: 'Medicine Dispensed',
  purchased: 'Medicine Purchased',
  stock_added: 'Stock Added',
  stock_adjusted: 'Stock Adjusted',
  return: 'Returns',
  expired: 'Expired Medicines',
  order: 'Prescription Orders',
};

export const STATUS_LABELS: Record<TransactionStatus, string> = {
  completed: 'Completed',
  pending: 'Pending',
  cancelled: 'Cancelled',
  returned: 'Returned',
  expired: 'Expired',
};

export const transactions: Transaction[] = [
  {
    id: 'TXN-88210',
    medicineName: 'Amoxicillin 500mg',
    batch: 'BT-8892',
    quantity: 21,
    unit: 'tablets',
    type: 'dispensed',
    status: 'completed',
    dateTime: 'Today • 10:24 AM',
    dateGroup: 'Today',
    staff: 'Ravi Menon',
    patientName: 'Arjun Sharma',
    patientId: 'ARJ-829',
    prescriptionId: 'RX-8821',
    reference: 'Counter Sale #4410',
    amount: '₹126.00',
    notes: 'Dispensed against e-prescription RX-8821. Verified by pharmacist.',
  },
  {
    id: 'TXN-88204',
    medicineName: 'Metformin 500mg',
    batch: 'BT-3321',
    quantity: 60,
    unit: 'tablets',
    type: 'dispensed',
    status: 'completed',
    dateTime: 'Today • 09:52 AM',
    dateGroup: 'Today',
    staff: 'Ravi Menon',
    patientName: 'Ramesh Gupta',
    patientId: 'RAM-556',
    prescriptionId: 'RX-9923',
    reference: 'Counter Sale #4409',
    amount: '₹210.00',
    notes: 'Monthly refill. Counselled on timing with meals.',
  },
  {
    id: 'TXN-88198',
    medicineName: 'Paracetamol 650mg',
    batch: 'BT-1029',
    quantity: 200,
    unit: 'tablets',
    type: 'stock_added',
    status: 'completed',
    dateTime: 'Today • 08:30 AM',
    dateGroup: 'Today',
    staff: 'Anita Deshmukh',
    supplier: 'MediSupply Pvt. Ltd.',
    reference: 'GRN-2026-0731',
    amount: '₹640.00',
    notes: 'Purchase order PO-5561 received. Batch verification complete.',
  },
  {
    id: 'TXN-88190',
    medicineName: 'Azithromycin 250mg',
    batch: 'BT-4411',
    quantity: 12,
    unit: 'tablets',
    type: 'order',
    status: 'pending',
    dateTime: 'Today • 07:15 AM',
    dateGroup: 'Today',
    staff: 'System',
    patientName: 'Neha Kapoor',
    patientId: 'NEH-441',
    prescriptionId: 'RX-9987',
    reference: 'Online Order #7712',
    amount: '₹342.00',
    notes: 'Awaiting stock confirmation — 12 units reserved.',
  },
  {
    id: 'TXN-88177',
    medicineName: 'Ceftriaxone 1g Injection',
    batch: 'BT-7712',
    quantity: 8,
    unit: 'vials',
    type: 'dispensed',
    status: 'completed',
    dateTime: 'Yesterday • 06:40 PM',
    dateGroup: 'Yesterday',
    staff: 'Ravi Menon',
    patientName: 'Meera Nair',
    patientId: 'MEE-654',
    prescriptionId: 'RX-9955',
    reference: 'Counter Sale #4402',
    amount: '₹1,120.00',
    notes: 'Cold-chain maintained. Administered at hospital IPD.',
  },
  {
    id: 'TXN-88170',
    medicineName: 'Insulin Glargine 100IU',
    batch: 'BT-6501',
    quantity: 3,
    unit: 'pens',
    type: 'return',
    status: 'returned',
    dateTime: 'Yesterday • 04:12 PM',
    dateGroup: 'Yesterday',
    staff: 'Anita Deshmukh',
    patientName: 'Ramesh Gupta',
    patientId: 'RAM-556',
    reference: 'Return #1120',
    amount: '₹1,890.00',
    notes: 'Sealed, unopened pens returned. Cold-chain log verified and restocked.',
  },
  {
    id: 'TXN-88165',
    medicineName: 'Ibuprofen 400mg',
    batch: 'BT-2208',
    quantity: 40,
    unit: 'tablets',
    type: 'expired',
    status: 'expired',
    dateTime: 'Yesterday • 10:00 AM',
    dateGroup: 'Yesterday',
    staff: 'Anita Deshmukh',
    reference: 'Expiry Audit EA-2026-19',
    amount: '₹180.00',
    notes: 'Batch expired Apr 2026. Segregated for safe disposal.',
  },
  {
    id: 'TXN-88151',
    medicineName: 'Atorvastatin 20mg',
    batch: 'BT-1187',
    quantity: 90,
    unit: 'tablets',
    type: 'purchased',
    status: 'completed',
    dateTime: 'May 18, 2026 • 11:20 AM',
    dateGroup: 'This Week',
    staff: 'Anita Deshmukh',
    supplier: 'HealthLink Distributors',
    reference: 'GRN-2026-0724',
    amount: '₹990.00',
    notes: 'Bulk purchase. Stored in rack B-04.',
  },
  {
    id: 'TXN-88144',
    medicineName: 'Cetirizine 10mg',
    batch: 'BT-3390',
    quantity: 30,
    unit: 'tablets',
    type: 'stock_adjusted',
    status: 'completed',
    dateTime: 'May 17, 2026 • 03:45 PM',
    dateGroup: 'This Week',
    staff: 'Ravi Menon',
    reference: 'Adjustment ADJ-0455',
    amount: '—',
    notes: 'Physical count reconciliation — 30 tablets damage write-off.',
  },
  {
    id: 'TXN-88138',
    medicineName: 'Pantoprazole 40mg',
    batch: 'BT-5520',
    quantity: 15,
    unit: 'tablets',
    type: 'order',
    status: 'cancelled',
    dateTime: 'May 16, 2026 • 01:30 PM',
    dateGroup: 'This Week',
    staff: 'System',
    patientName: 'Sohail Khan',
    patientId: 'SOH-320',
    prescriptionId: 'RX-9911',
    reference: 'Online Order #7698',
    amount: '₹165.00',
    notes: 'Cancelled by patient. Stock released back to inventory.',
  },
  {
    id: 'TXN-88120',
    medicineName: 'Vitamin D3 60K',
    batch: 'BT-4012',
    quantity: 10,
    unit: 'sachets',
    type: 'dispensed',
    status: 'completed',
    dateTime: 'May 12, 2026 • 09:10 AM',
    dateGroup: 'Earlier',
    staff: 'Ravi Menon',
    patientName: 'Kavita Rao',
    patientId: 'KAV-703',
    prescriptionId: 'RX-9888',
    reference: 'Counter Sale #4388',
    amount: '₹250.00',
    notes: 'Weekly sachet therapy — counselled on administration.',
  },
  {
    id: 'TXN-88101',
    medicineName: 'Ondansetron 4mg',
    batch: 'BT-2981',
    quantity: 6,
    unit: 'tablets',
    type: 'return',
    status: 'returned',
    dateTime: 'May 09, 2026 • 05:50 PM',
    dateGroup: 'Earlier',
    staff: 'Anita Deshmukh',
    patientName: 'Ritika Singh',
    patientId: 'RIT-118',
    reference: 'Return #1104',
    amount: '₹96.00',
    notes: 'Patient-reported adverse reaction. Returned per policy.',
  },
];
