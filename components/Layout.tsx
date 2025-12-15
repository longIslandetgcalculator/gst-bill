import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Package, Settings, Info, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

const NavItem = ({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      clsx(
        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200",
        isActive
          ? "bg-primary text-white shadow-md"
          : "text-slate-600 hover:bg-slate-100"
      )
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden no-print">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 h-full shadow-sm z-10">
        <div className="p-6 border-b border-slate-100 flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">G</div>
          <span className="text-xl font-bold text-slate-800">GST Maker</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/invoices" icon={FileText} label="Invoices" />
          <NavItem to="/clients" icon={Users} label="Clients" />
          <NavItem to="/products" icon={Package} label="Products" />
          <div className="pt-4 pb-2">
            <div className="h-px bg-slate-200 mx-2"></div>
          </div>
          <NavItem to="/settings" icon={Settings} label="Settings" />
          <NavItem to="/about" icon={Info} label="About" />
        </nav>

        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center">
          Created by calculatordekho.com
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20">
        <span className="text-lg font-bold text-slate-800">GST Maker</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-10 bg-white pt-16 md:hidden">
          <nav className="p-4 space-y-2">
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/invoices" icon={FileText} label="Invoices" />
            <NavItem to="/clients" icon={Users} label="Clients" />
            <NavItem to="/products" icon={Package} label="Products" />
            <NavItem to="/settings" icon={Settings} label="Settings" />
            <NavItem to="/about" icon={Info} label="About" />
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:p-6 p-4 pt-20 md:pt-6 relative">
        <Outlet />
      </main>
    </div>
  );
}
