import { Outlet, NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../shared/LanguageSwitcher.jsx';

export default function MarketingLayout() {
  const { t } = useTranslation();

  const navItems = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/services', label: t('nav.services') },
    { to: '/insight', label: t('nav.insight') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <div className="min-h-screen bg-ansaka-paper">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-serif text-xl font-semibold text-ansaka-ink">
            ANSAKA
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}
                className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-ansaka-gold' : 'text-ansaka-ink hover:text-ansaka-gold'}`}>
                {item.label}
              </NavLink>
            ))}
            <LanguageSwitcher />
            <Link to="/login" className="text-sm font-medium text-ansaka-muted hover:text-ansaka-gold">{t('common.login')}</Link>
            <Link to="/register" className="btn-primary py-2 text-xs">{t('common.register')}</Link>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-ansaka-muted">
              © {new Date().getFullYear()} ANSAKA Consulting · Part of Mitologi Inspira Group
            </p>
            <div className="flex gap-4 text-sm text-ansaka-muted">
              <Link to="/about" className="hover:text-ansaka-gold">{t('nav.about')}</Link>
              <Link to="/contact" className="hover:text-ansaka-gold">{t('nav.contact')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
