import { BusinessProfile, Client, Invoice, Product } from '../types';

const KEYS = {
  PROFILE: 'gst_app_profile',
  CLIENTS: 'gst_app_clients',
  PRODUCTS: 'gst_app_products',
  INVOICES: 'gst_app_invoices',
};

// Default Profile
const DEFAULT_PROFILE: BusinessProfile = {
  name: "My Business",
  address: "123 Business St, Tech City",
  phone: "9876543210",
  email: "contact@business.com",
  gstin: "",
  terms: "1. Goods once sold will not be taken back.\n2. Interest @18% pa will be charged if payment is delayed.",
};

export const StorageService = {
  getProfile: (): BusinessProfile => {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  },
  saveProfile: (profile: BusinessProfile) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  getClients: (): Client[] => {
    const data = localStorage.getItem(KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  },
  saveClient: (client: Client) => {
    const clients = StorageService.getClients();
    const index = clients.findIndex(c => c.id === client.id);
    if (index >= 0) clients[index] = client;
    else clients.push(client);
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
  },
  deleteClient: (id: string) => {
    const clients = StorageService.getClients().filter(c => c.id !== id);
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
  },

  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },
  saveProduct: (product: Product) => {
    const products = StorageService.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) products[index] = product;
    else products.push(product);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },
  deleteProduct: (id: string) => {
    const products = StorageService.getProducts().filter(p => p.id !== id);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  getInvoices: (): Invoice[] => {
    const data = localStorage.getItem(KEYS.INVOICES);
    return data ? JSON.parse(data) : [];
  },
  saveInvoice: (invoice: Invoice) => {
    const invoices = StorageService.getInvoices();
    const index = invoices.findIndex(i => i.id === invoice.id);
    if (index >= 0) invoices[index] = invoice;
    else invoices.push(invoice);
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
  },
  deleteInvoice: (id: string) => {
    const invoices = StorageService.getInvoices().filter(i => i.id !== id);
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
  },
  
  getNextInvoiceNumber: (): string => {
    const invoices = StorageService.getInvoices();
    const count = invoices.length + 1;
    return `INV-${String(count).padStart(4, '0')}`;
  }
};
