import { ItemsCollection } from '../components/ItemsCollection';
import { useState } from 'react';

interface CardContent {
	id: number;
	imageUrl: string;
	imageAlt: string;
	title: string;
	description: string;
}

const contet: CardContent[] = [
	{
		id: 1,
		imageUrl: "https://cdn.delever.uz/delever/16e1693d-8d1d-44bc-8f5e-da4b1f556773",
		imageAlt: "Lavash",
		title: "Bu Lavash",
		description: "lavash"
	},
	{
		id: 2,
		imageUrl: "https://maxway.uz/_next/image?url=https%3A%2F%2Fcdn.delever.uz%2Fdelever%2Fa70bf83c-6971-470c-a7bd-43498e140a56&w=3840&q=75",
		imageAlt: "Burger",
		title: "Bu Burger",
		description: "burger"
	},
	{
		id: 3,
		imageUrl: "https://cdn-kz19.foodpicasso.com/assets/f0/2c/76/c8/f02c76c831c565b8b01be97e1a284749---jpg_375x375:whitepadding15_9edf7_convert.jpg?v2",
		imageAlt: "Xot-dog",
		title: "Bu xot-dog",
		description: "AIJAIJAA"
	},
];

export const HomePage = () => {
	const [selectedId, setSelectedId] = useState<number>(1);
	const searchId = contet.find((item) => item.id === selectedId);

	return (
		<div className="mx-auto max-w-5xl px-6 py-16 text-stone-900 sm:py-24">
			{/* <section className="mb-10 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
				<div className="space-y-3">
					<div className="rounded-lg bg-stone-50 p-4">
						<span className="text-xs font-semibold uppercase tracking-wider text-stone-400">1</span>
						<p className="mt-1 text-base font-semibold text-stone-900">{t('example1')}</p>
					</div>
					<div className="rounded-lg bg-stone-50 p-4">
						<span className="text-xs font-semibold uppercase tracking-wider text-stone-400">2</span>
						<p className="mt-1 text-sm text-stone-700">{t('example2')}</p>
					</div>
					<div className="rounded-lg bg-stone-50 p-4">
						<span className="text-xs font-semibold uppercase tracking-wider text-stone-400">3</span>
						<p className="mt-1 text-sm text-stone-700">{t('example3')}</p>
					</div>
					<div className="rounded-lg bg-stone-50 p-4">
						<span className="text-xs font-semibold uppercase tracking-wider text-stone-400">4</span>
						<p className="mt-1 text-sm text-stone-700">{t('example4')}</p>
					</div>
				</div>
			</section> */}

			<ItemsCollection />
			<br />


			<div className="gap-3 flex text-center mb-6">
				<button
					onClick={() => setSelectedId(1)}
					className={`px-4 py-2 font-medium  ${selectedId === 1 ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
					Lavash
				</button>

				<button
					onClick={() => setSelectedId(2)}
					className={`px-4 py-2 font-medium  ${selectedId === 2 ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
					Burger
				</button>

				<button
					onClick={() => setSelectedId(3)}
					className={`px-4 py-2 font-medium  ${selectedId === 3 ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
					Xot-dog
				</button>
			</div>

			{searchId && (
				<div className="max-w-sm overflow-hidden shadow-lg bg-white p-6 flex flex-col items-center text-center">
					<img
						className="h-[200px] w-full object-cover mb-4"
						src={searchId.imageUrl}
						alt={searchId.imageAlt}
					/>
					<h2 className="text-xl text-gray-900">{searchId.title}</h2>
					<p className="text-gray-600">{searchId.description}</p>
				</div>
				
			)}
		</div>
	);
};
