export interface BusinessProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  logoUrl?: string;
  signatureUrl?: string;
  terms: string;
}

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  gstin?: string;
}

export interface Product {
  id: string;
  name: string;
  hsnSac: string;
  costPrice: number;
  sellingPrice: number;
  taxRate: number; // 0, 5, 12, 18, 28
  stock?: number;
}

export interface InvoiceItem {
  id: string;
  productId?: string;
  name: string;
  hsnSac: string;
  quantity: number;
  price: number;
  discount: number; // Percentage
  taxRate: number;
}

export enum InvoiceType {
  GST = 'GST',
  NON_GST = 'NON_GST',
  BILL = 'BILL', // Retail/Wholesale simplified
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string; // ISO string
  dueDate: string; // ISO string
  type: InvoiceType;
  seller: BusinessProfile;
  buyer: Client;
  items: InvoiceItem[];
  
  // Totals
  totalBeforeTax: number;
  totalTax: number;
  totalAmount: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  
  isInterState: boolean; // Determines IGST vs CGST/SGST
  status: 'Draft' | 'Paid' | 'Unpaid';
  amountInWords?: string;
}

export interface DashboardStats {
  totalSales: number;
  totalGst: number;
  pendingAmount: number;
  invoiceCount: number;
}
