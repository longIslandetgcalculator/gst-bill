import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storageService';
import { BusinessProfile, Client, Invoice, InvoiceItem, InvoiceType, Product } from '../types';
import { Plus, Trash2, Save, UserPlus, PackagePlus } from 'lucide-react';

export default function InvoiceForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<BusinessProfile>(StorageService.getProfile());
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Form State
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(InvoiceType.GST);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  
  // Helper for new client toggle
  const [isNewClient, setIsNewClient] = useState(false);
  const [newClient, setNewClient] = useState<Client>({ id: '', name: '', address: '', phone: '' });

  useEffect(() => {
    setClients(StorageService.getClients());
    setProducts(StorageService.getProducts());
  }, []);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: '',
      hsnSac: '',
      quantity: 1,
      price: 0,
      discount: 0,
      taxRate: invoiceType === InvoiceType.NON_GST ? 0 : 18,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleProductSelect = (itemId: string, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setItems(items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            productId: product.id,
            name: product.name,
            hsnSac: product.hsnSac,
            price: product.sellingPrice,
            taxRate: invoiceType === InvoiceType.NON_GST ? 0 : product.taxRate,
          };
        }
        return item;
      }));
    }
  };

  const calculateTotals = () => {
    let totalBeforeTax = 0;
    let totalTax = 0;

    items.forEach(item => {
      const amount = item.quantity * item.price;
      const discountAmount = amount * (item.discount / 100);
      const taxableValue = amount - discountAmount;
      const taxAmount = taxableValue * (item.taxRate / 100);

      totalBeforeTax += taxableValue;
      totalTax += taxAmount;
    });

    return { totalBeforeTax, totalTax, totalAmount: totalBeforeTax + totalTax };
  };

  const handleSave = () => {
    let buyer = selectedClient;
    if (isNewClient) {
      buyer = { ...newClient, id: Date.now().toString() };
      StorageService.saveClient(buyer);
    }

    if (!buyer || items.length === 0) {
      alert("Please select a buyer and add at least one item.");
      return;
    }

    const { totalBeforeTax, totalTax, totalAmount } = calculateTotals();
    const isInterState = buyer.gstin && profile.gstin ? buyer.gstin.substring(0, 2) !== profile.gstin.substring(0, 2) : false;

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: StorageService.getNextInvoiceNumber(),
      date: invoiceDate,
      dueDate: dueDate,
      type: invoiceType,
      seller: profile,
      buyer: buyer,
      items: items,
      totalBeforeTax,
      totalTax,
      totalAmount,
      cgst: isInterState ? 0 : totalTax / 2,
      sgst: isInterState ? 0 : totalTax / 2,
      igst: isInterState ? totalTax : 0,
      isInterState,
      status: 'Unpaid',
      // Simplified amount in words placeholder
      amountInWords: `Rupees ${Math.round(totalAmount)} Only`
    };

    StorageService.saveInvoice(newInvoice);
    navigate('/invoices');
  };

  const totals = calculateTotals();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Create Invoice</h1>
        <div className="flex space-x-2">
           <select 
             className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
             value={invoiceType}
             onChange={(e) => setInvoiceType(e.target.value as InvoiceType)}
           >
             <option value={InvoiceType.GST}>GST Invoice</option>
             <option value={InvoiceType.NON_GST}>Non-GST Invoice</option>
             <option value={InvoiceType.BILL}>Bill of Supply</option>
           </select>
        </div>
      </div>

      {/* Client Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Customer Details</h2>
          <button 
            onClick={() => setIsNewClient(!isNewClient)} 
            className="text-primary text-sm flex items-center hover:underline"
          >
            {isNewClient ? 'Select Existing' : <><UserPlus size={16} className="mr-1"/> New Client</>}
          </button>
        </div>
        
        {isNewClient ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Client Name" className="border p-2 rounded" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
            <input placeholder="Phone" className="border p-2 rounded" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
            <input placeholder="Address" className="border p-2 rounded" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} />
            {invoiceType === InvoiceType.GST && (
              <input placeholder="GSTIN" className="border p-2 rounded" value={newClient.gstin || ''} onChange={e => setNewClient({...newClient, gstin: e.target.value})} />
            )}
          </div>
        ) : (
          <select 
            className="w-full border border-slate-300 rounded-lg p-3"
            onChange={(e) => setSelectedClient(clients.find(c => c.id === e.target.value) || null)}
            value={selectedClient?.id || ''}
          >
            <option value="">Select a Customer</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {/* Dates */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-2 gap-4">
         <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Date</label>
           <input type="date" className="w-full border p-2 rounded" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
         </div>
         <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
           <input type="date" className="w-full border p-2 rounded" value={dueDate} onChange={e => setDueDate(e.target.value)} />
         </div>
      </div>

      {/* Items */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Items</h2>
          <button onClick={addItem} className="text-primary text-sm flex items-center hover:underline font-medium">
             <Plus size={16} className="mr-1"/> Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative">
               <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                 <Trash2 size={16} />
               </button>
               <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                 <div className="md:col-span-2">
                   <label className="text-xs text-slate-500">Product</label>
                   <input 
                     list={`products-${item.id}`} 
                     className="w-full border p-1 rounded text-sm" 
                     placeholder="Product Name"
                     value={item.name}
                     onChange={(e) => {
                       const val = e.target.value;
                       const prod = products.find(p => p.name === val);
                       if (prod) handleProductSelect(item.id, prod.id);
                       else updateItem(item.id, 'name', val);
                     }}
                   />
                   <datalist id={`products-${item.id}`}>
                     {products.map(p => <option key={p.id} value={p.name} />)}
                   </datalist>
                 </div>
                 <div>
                   <label className="text-xs text-slate-500">Qty</label>
                   <input type="number" className="w-full border p-1 rounded text-sm" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value))} />
                 </div>
                 <div>
                   <label className="text-xs text-slate-500">Price</label>
                   <input type="number" className="w-full border p-1 rounded text-sm" value={item.price} onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value))} />
                 </div>
                 {invoiceType === InvoiceType.GST && (
                   <div>
                     <label className="text-xs text-slate-500">Tax %</label>
                     <select className="w-full border p-1 rounded text-sm" value={item.taxRate} onChange={e => updateItem(item.id, 'taxRate', parseFloat(e.target.value))}>
                       <option value="0">0%</option>
                       <option value="5">5%</option>
                       <option value="12">12%</option>
                       <option value="18">18%</option>
                       <option value="28">28%</option>
                     </select>
                   </div>
                 )}
                 <div>
                   <label className="text-xs text-slate-500">Total</label>
                   <div className="p-1 text-sm font-bold text-slate-700">
                     {((item.quantity * item.price) * (1 + item.taxRate/100)).toFixed(2)}
                   </div>
                 </div>
               </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-slate-400 py-4">No items added.</p>}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
         <div className="flex justify-between text-sm mb-2">
           <span className="text-slate-600">Subtotal</span>
           <span className="font-medium">₹{totals.totalBeforeTax.toFixed(2)}</span>
         </div>
         {invoiceType === InvoiceType.GST && (
           <div className="flex justify-between text-sm mb-2">
             <span className="text-slate-600">Total GST</span>
             <span className="font-medium">₹{totals.totalTax.toFixed(2)}</span>
           </div>
         )}
         <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
           <span className="text-slate-800">Grand Total</span>
           <span className="text-primary">₹{totals.totalAmount.toFixed(2)}</span>
         </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:relative md:bg-transparent md:border-none md:p-0 flex justify-end">
         <button 
           onClick={handleSave} 
           className="bg-primary hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center shadow-lg transition-transform active:scale-95"
         >
           <Save className="mr-2" size={20} /> Save & Generate
         </button>
      </div>
    </div>
  );
}
