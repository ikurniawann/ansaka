import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

export default function AdminLayout() {
  const { t } = useTranslation();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/login');
  }

  const navItems = [
    { to: '/admin', label: 'Overview', end: true },
    { to: '/admin/organizations', label: t('admin.organizations') },
    { to: '/admin/batches', label: t('admin.batches') },
    { to: '/admin/credits', label: t('admin.credits') },
    { to: '/admin/packages', label: t('admin.packages') },
    { to: '/admin/pricing', label: t('admin.pricing') },
    { to: '/admin/formulas', label: t('admin.formulas') },
    { to: '/admin/benchmark', label: t('admin.benchmark') },
    { to: '/admin/cms', label: t('admin.cms') },
  ];

  return (
    <div className="flex min-h-screen bg-ansaka-paper">
      <aside className="w-64 shrink-0 border-r border-gray-200 bg-ansaka-ink text-white">
        <div className="border-b border-gray-700 px-6 py-5">
          <h1 className="font-serif text-lg font-semibold">ANSAKA</h1>
          <p className="text-xs text-gray-400">Super Admin Panel</p>
        </div>
        <nav className="px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-ansaka-gold text-white' : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 w-56 space-y-2 border-t border-gray-700 pt-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="truncate">{profile?.email}</span>
            <LanguageSwitcher />
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-md border border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-800"
          >
            {t('common.logout')}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
