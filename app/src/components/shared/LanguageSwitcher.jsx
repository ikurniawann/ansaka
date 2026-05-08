import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation();

  function toggle() {
    const next = i18n.language === 'id' ? 'en' : 'id';
    i18n.changeLanguage(next);
  }

  return (
    <button
      onClick={toggle}
      className={`text-xs font-medium uppercase tracking-wider text-ansaka-muted hover:text-ansaka-gold transition-colors ${className}`}
      aria-label="Toggle language"
    >
      {i18n.language === 'id' ? 'EN' : 'ID'}
    </button>
  );
}
