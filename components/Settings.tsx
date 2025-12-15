import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { BusinessProfile } from '../types';
import { Save } from 'lucide-react';

export default function Settings() {
  const [profile, setProfile] = useState<BusinessProfile>(StorageService.getProfile());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    StorageService.saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Business Settings</h1>
        <p className="text-slate-500">Manage your company details shown on invoices.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Company Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
            <input 
              className="w-full border border-slate-300 rounded-lg p-2.5" 
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">GSTIN</label>
            <input 
              className="w-full border border-slate-300 rounded-lg p-2.5" 
              value={profile.gstin}
              onChange={e => setProfile({...profile, gstin: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input 
              className="w-full border border-slate-300 rounded-lg p-2.5" 
              value={profile.phone}
              onChange={e => setProfile({...profile, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              className="w-full border border-slate-300 rounded-lg p-2.5" 
              value={profile.email}
              onChange={e => setProfile({...profile, email: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <textarea 
              className="w-full border border-slate-300 rounded-lg p-2.5 h-24" 
              value={profile.address}
              onChange={e => setProfile({...profile, address: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Terms & Conditions</label>
            <textarea 
              className="w-full border border-slate-300 rounded-lg p-2.5 h-32" 
              value={profile.terms}
              onChange={e => setProfile({...profile, terms: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
         <p className="text-sm text-slate-500">
           Permanently branded with <span className="font-semibold">"Created by https://calculatordekho.com"</span>
         </p>
         <button 
           onClick={handleSave}
           className="bg-primary hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition"
         >
           <Save size={18} className="mr-2" /> 
           {saved ? 'Saved!' : 'Save Settings'}
         </button>
      </div>
    </div>
  );
}
