import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { Client, Product } from '../types';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Client>({ id: '', name: '', address: '', phone: '', gstin: '' });

  const loadData = () => setClients(StorageService.getClients());
  useEffect(() => loadData(), []);

  const handleSave = () => {
    StorageService.saveClient({ ...formData, id: formData.id || Date.now().toString() });
    setIsFormOpen(false);
    loadData();
    setFormData({ id: '', name: '', address: '', phone: '', gstin: '' });
  };

  const handleDelete = (id: string) => {
    if(confirm('Delete client?')) {
      StorageService.deleteClient(id);
      loadData();
    }
  };

  const handleEdit = (client: Client) => {
    setFormData(client);
    setIsFormOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Clients</h1>
        <button onClick={() => { setFormData({id:'', name:'', address:'', phone:''}); setIsFormOpen(true); }} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center">
          <Plus size={18} className="mr-2"/> Add Client
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit' : 'Add'} Client</h2>
            <div className="space-y-3">
              <input placeholder="Name" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input placeholder="Phone" className="w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <input placeholder="GSTIN (Optional)" className="w-full border p-2 rounded" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} />
              <textarea placeholder="Address" className="w-full border p-2 rounded" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Name</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Phone</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">GSTIN</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="p-4 text-sm font-medium">{c.name}</td>
                <td className="p-4 text-sm text-slate-600">{c.phone}</td>
                <td className="p-4 text-sm text-slate-600">{c.gstin || '-'}</td>
                <td className="p-4 text-right flex justify-end space-x-2">
                  <button onClick={() => handleEdit(c)} className="text-primary"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-500"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Product>({ id: '', name: '', hsnSac: '', costPrice: 0, sellingPrice: 0, taxRate: 18 });

  const loadData = () => setProducts(StorageService.getProducts());
  useEffect(() => loadData(), []);

  const handleSave = () => {
    StorageService.saveProduct({ ...formData, id: formData.id || Date.now().toString() });
    setIsFormOpen(false);
    loadData();
    setFormData({ id: '', name: '', hsnSac: '', costPrice: 0, sellingPrice: 0, taxRate: 18 });
  };

  const handleDelete = (id: string) => {
    if(confirm('Delete product?')) {
      StorageService.deleteProduct(id);
      loadData();
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsFormOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Products</h1>
        <button onClick={() => { setFormData({id:'', name:'', hsnSac:'', costPrice:0, sellingPrice:0, taxRate:18}); setIsFormOpen(true); }} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center">
          <Plus size={18} className="mr-2"/> Add Product
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit' : 'Add'} Product</h2>
            <div className="space-y-3">
              <input placeholder="Product Name" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input placeholder="HSN/SAC Code" className="w-full border p-2 rounded" value={formData.hsnSac} onChange={e => setFormData({...formData, hsnSac: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Cost Price" className="border p-2 rounded" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})} />
                <input type="number" placeholder="Selling Price" className="border p-2 rounded" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: parseFloat(e.target.value)})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col text-sm">
                   Tax Rate (%)
                   <select className="border p-2 rounded mt-1" value={formData.taxRate} onChange={e => setFormData({...formData, taxRate: parseFloat(e.target.value)})}>
                     <option value={0}>0%</option>
                     <option value={5}>5%</option>
                     <option value={12}>12%</option>
                     <option value={18}>18%</option>
                     <option value={28}>28%</option>
                   </select>
                </label>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Name</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">HSN</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Price</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Tax</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="p-4 text-sm font-medium">{p.name}</td>
                <td className="p-4 text-sm text-slate-600">{p.hsnSac || '-'}</td>
                <td className="p-4 text-sm text-slate-600">₹{p.sellingPrice}</td>
                <td className="p-4 text-sm text-slate-600">{p.taxRate}%</td>
                <td className="p-4 text-right flex justify-end space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-primary"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
