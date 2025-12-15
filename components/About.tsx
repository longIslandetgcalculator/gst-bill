import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function About() {
  const faqs = [
    { q: "What is a GST Invoice?", a: "A tax invoice issued by a GST-registered seller showing GST breakup." },
    { q: "Can I generate invoice without GST?", a: "Yes, Non-GST invoice option available." },
    { q: "Does the app store data online?", a: "No, all data remains on device (Local Storage)." },
    { q: "How to export invoice?", a: "Create → View → Print → Save as PDF." },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">GST Bill & Invoice Maker</h1>
        <p className="text-slate-500 mb-4">Version 1.0.0 (Web Edition)</p>
        <div className="inline-block bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
          Powered by https://calculatordekho.com
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <HelpCircle className="mr-2 text-primary" /> FAQ
        </h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
              <h3 className="font-semibold text-slate-800 mb-1">{f.q}</h3>
              <p className="text-slate-600 text-sm">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-slate-400 pb-8">
        © {new Date().getFullYear()} GST Bill & Invoice Maker. All rights reserved. <br/>
        Created by https://calculatordekho.com
      </div>
    </div>
  );
}
