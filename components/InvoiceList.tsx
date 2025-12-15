import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storageService';
import { Invoice } from '../types';
import { Plus, Eye, Trash2 } from 'lucide-react';

export default function InvoiceList() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);

  React.useEffect(() => {
    setInvoices(StorageService.getInvoices().reverse());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      StorageService.deleteInvoice(id);
      setInvoices(StorageService.getInvoices().reverse());
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Invoices</h1>
        <button 
          onClick={() => navigate('/invoices/new')} 
          className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition"
        >
          <Plus size={18} className="mr-2" /> Create New
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Inv No</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No invoices generated yet. Create your first one!
                  </td>
                </tr>
              ) : (
                invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="p-4 text-sm font-medium text-slate-800">{inv.invoiceNumber}</td>
                    <td className="p-4 text-sm text-slate-600">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-slate-600">{inv.buyer.name}</td>
                    <td className="p-4 text-sm font-bold text-slate-800">₹{inv.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => navigate(`/invoices/${inv.id}`)} className="p-2 text-slate-500 hover:text-primary hover:bg-indigo-50 rounded">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleDelete(inv.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
