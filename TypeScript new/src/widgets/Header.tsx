import { useTranslation } from 'react-i18next';

function Header() {
	const { t, i18n } = useTranslation('common');
	const path = window.location.pathname;

	return (
		<header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
			<nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5" aria-label="Main navigation">
				<a href="/" className="text-lg font-semibold tracking-tight text-stone-900">
					<span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-emerald-600" />
					{t('brand')}
				</a>
				<div className="flex items-center gap-7 text-sm">
					<a href="/" aria-current={path === '/' ? 'page' : undefined} className={`transition-colors hover:text-stone-950 ${path === '/' ? 'font-medium text-stone-900' : 'text-stone-500'}`}>
						{t('nav_home')}
					</a>
					<a href="/catalog" aria-current={path === '/catalog' ? 'page' : undefined} className={`transition-colors hover:text-stone-950 ${path === '/catalog' ? 'font-medium text-stone-900' : 'text-stone-500'}`}>
						{t('nav_catalog')}
					</a>
					<a href="/test" aria-current={path === '/test' ? 'page' : undefined} className={`transition-colors hover:text-stone-950 ${path === '/test' ? 'font-medium text-stone-900' : 'text-stone-500'}`}>
						{t('nav_test')}
					</a>
					<a href="/about" aria-current={path === '/about' ? 'page' : undefined} className={`transition-colors hover:text-stone-950 ${path === '/about' ? 'font-medium text-stone-900' : 'text-stone-500'}`}>
						{t('nav_about')}
					</a>
					<select
						value={i18n.resolvedLanguage || i18n.language}
						onChange={(e) => i18n.changeLanguage(e.target.value)}
						aria-label={t('select_language')}
						className="rounded-md border border-stone-300 bg-stone-50 px-2 py-1 text-xs text-stone-800 outline-none focus:border-stone-500"
					>
						<option value="uz">UZ</option>
						<option value="ru">RU</option>
						<option value="es">ES</option>
					</select>
				</div>
			</nav>
		</header>
	);
}

export default Header;
