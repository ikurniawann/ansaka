import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

export default function DashboardLayout() {
  const { t } = useTranslation();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/login');
  }

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard'), end: true },
    { to: '/dashboard/batches', label: t('nav.batches') },
    { to: '/dashboard/credits', label: t('nav.credits') },
    { to: '/dashboard/settings', label: t('nav.settings') },
  ];

  return (
    <div className="flex min-h-screen bg-ansaka-paper">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <h1 className="font-serif text-lg font-semibold text-ansaka-ink">ANSAKA</h1>
          <p className="text-xs text-ansaka-muted">OAM Insight™</p>
          {profile?.organizations && (
            <p className="mt-2 text-xs font-medium text-ansaka-gold">{profile.organizations.name}</p>
          )}
        </div>
        <nav className="px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-ansaka-gold/10 text-ansaka-gold-dark'
                    : 'text-ansaka-ink hover:bg-gray-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 w-56 space-y-2 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-xs text-ansaka-muted">
            <span className="truncate">{profile?.email}</span>
            <LanguageSwitcher />
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-ansaka-ink hover:bg-gray-50"
          >
            {t('common.logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
