import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storageService';
import { Invoice, InvoiceType } from '../types';
import { ArrowLeft, Printer, Share2 } from 'lucide-react';

export default function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const invoices = StorageService.getInvoices();
    const found = invoices.find(i => i.id === id);
    if (found) setInvoice(found);
    else navigate('/invoices');
  }, [id, navigate]);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 md:p-8 p-4">
      {/* Action Bar (Hidden in Print) */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center no-print">
        <button onClick={() => navigate('/invoices')} className="flex items-center text-slate-600 hover:text-slate-900">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <div className="flex space-x-3">
          <button onClick={handlePrint} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            <Printer size={18} className="mr-2" /> Print / PDF
          </button>
        </div>
      </div>

      {/* A4 Paper Canvas */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-xl min-h-[297mm] p-[10mm] relative print:shadow-none print:w-full">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
           <div>
             <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-wide">
               {invoice.type === InvoiceType.NON_GST ? 'INVOICE' : 'TAX INVOICE'}
             </h1>
             {invoice.type === InvoiceType.NON_GST && (
               <span className="text-xs bg-slate-200 px-2 py-1 rounded mt-1 inline-block">This is a Non-GST Invoice</span>
             )}
             <p className="mt-4 text-slate-500 text-sm">Invoice No: <span className="font-bold text-slate-800">{invoice.invoiceNumber}</span></p>
             <p className="text-slate-500 text-sm">Date: <span className="font-bold text-slate-800">{new Date(invoice.date).toLocaleDateString()}</span></p>
           </div>
           <div className="text-right">
             <h2 className="text-xl font-bold text-slate-800">{invoice.seller.name}</h2>
             <p className="text-sm text-slate-600 whitespace-pre-line max-w-[250px]">{invoice.seller.address}</p>
             <p className="text-sm text-slate-600">Phone: {invoice.seller.phone}</p>
             <p className="text-sm text-slate-600">Email: {invoice.seller.email}</p>
             {invoice.seller.gstin && <p className="text-sm font-bold text-slate-800 mt-1">GSTIN: {invoice.seller.gstin}</p>}
           </div>
        </div>

        {/* Bill To */}
        <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Bill To</p>
          <h3 className="text-lg font-bold text-slate-900">{invoice.buyer.name}</h3>
          <p className="text-sm text-slate-700">{invoice.buyer.address}</p>
          <p className="text-sm text-slate-700">Phone: {invoice.buyer.phone}</p>
          {invoice.buyer.gstin && <p className="text-sm font-semibold text-slate-800 mt-1">GSTIN: {invoice.buyer.gstin}</p>}
        </div>

        {/* Table */}
        <table className="w-full text-left border-collapse mb-8">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="py-2 text-sm font-bold text-slate-700">Item</th>
              <th className="py-2 text-sm font-bold text-slate-700 text-right">Qty</th>
              <th className="py-2 text-sm font-bold text-slate-700 text-right">Rate</th>
              {invoice.type === InvoiceType.GST && <th className="py-2 text-sm font-bold text-slate-700 text-right">Tax %</th>}
              <th className="py-2 text-sm font-bold text-slate-700 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="py-3">
                  <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                  {item.hsnSac && <p className="text-xs text-slate-500">HSN: {item.hsnSac}</p>}
                </td>
                <td className="py-3 text-right text-sm text-slate-700">{item.quantity}</td>
                <td className="py-3 text-right text-sm text-slate-700">{item.price.toFixed(2)}</td>
                {invoice.type === InvoiceType.GST && <td className="py-3 text-right text-sm text-slate-700">{item.taxRate}%</td>}
                <td className="py-3 text-right text-sm font-medium text-slate-900">
                  {((item.quantity * item.price) * (invoice.type === InvoiceType.GST ? (1 + item.taxRate/100) : 1)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>₹{invoice.totalBeforeTax.toFixed(2)}</span>
            </div>
            {invoice.type === InvoiceType.GST && (
              <>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Total Tax</span>
                  <span>₹{invoice.totalTax.toFixed(2)}</span>
                </div>
                {invoice.isInterState ? (
                  <div className="flex justify-between text-xs text-slate-500 pl-4">
                    <span>IGST</span>
                    <span>₹{invoice.igst?.toFixed(2)}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-xs text-slate-500 pl-4">
                      <span>CGST</span>
                      <span>₹{invoice.cgst?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 pl-4">
                      <span>SGST</span>
                      <span>₹{invoice.sgst?.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </>
            )}
            <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-300 pt-2">
              <span>Grand Total</span>
              <span>₹{invoice.totalAmount.toFixed(2)}</span>
            </div>
            <p className="text-right text-xs text-slate-500 mt-1">{invoice.amountInWords}</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-6 mt-auto">
          <div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">Terms & Conditions</h4>
            <p className="text-xs text-slate-500 whitespace-pre-line">{invoice.seller.terms}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="h-16 w-32 bg-slate-50 border border-dashed border-slate-300 mb-2 flex items-center justify-center text-xs text-slate-400">
              Signature
            </div>
            <p className="text-xs font-bold text-slate-800">Authorized Signatory</p>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-[10px] text-slate-400">
            Created by <a href="https://calculatordekho.com" className="text-slate-500 underline">https://calculatordekho.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
