import React from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InvoiceList from './components/InvoiceList';
import InvoiceForm from './components/InvoiceForm';
import InvoiceView from './components/InvoiceView';
import Settings from './components/Settings';
import About from './components/About';
import { Clients, Products } from './components/Inventory';

const App = () => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/new" element={<InvoiceForm />} />
          <Route path="clients" element={<Clients />} />
          <Route path="products" element={<Products />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
        </Route>
        {/* Invoice View is outside Layout to simplify printing */}
        <Route path="/invoices/:id" element={<InvoiceView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MemoryRouter>
  );
};

export default App;