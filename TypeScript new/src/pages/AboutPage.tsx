import { useTranslation } from 'react-i18next';
import { ItemsCollection } from '../components/ItemsCollection';

export function AboutPage() {
	const { t } = useTranslation('products');

	return (
		<div className="mx-auto min-h-[calc(100vh-73px)] max-w-5xl px-6 py-16 text-stone-900 sm:py-24">
			<ItemsCollection title={t('preview_title')} showForm={false} />
		</div>
	);
}
