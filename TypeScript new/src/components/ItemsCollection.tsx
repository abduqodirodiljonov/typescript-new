import { useState, type SubmitEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';

interface Item {
	id: string | number;
	title: string;
	price: number;
}

interface ItemsCollectionProps {
	title?: string;
	showForm?: boolean;
}

function useGetTodosDetail(id: string) {
	return useQuery<Item>({
		queryKey: ['items', id],
		queryFn: async () => {
			const res = await axios.get<Item>(`http://localhost:3000/todos/${id}`);
			return res.data;
		},
		enabled: !!id,
	});
}

export function ItemsCollection({ title, showForm = true }: ItemsCollectionProps) {
	const { t } = useTranslation('products');
	const displayTitle = title ?? t('collection_title');

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<Item | null>(null);
	const [todosItemId, setTodosItemId] = useState<string>('');

	const { data: todoDetail } = useGetTodosDetail(todosItemId);

	const queryClient = useQueryClient();
	const { data: items, isLoading, isError } = useQuery({
		queryKey: ['items'],
		queryFn: async () => (await axios.get<Item[]>('http://localhost:3000/todos')).data,
	});

	const refreshItems = () => queryClient.invalidateQueries({ queryKey: ['items'] });

	const addMutation = useMutation({
		mutationFn: async (newItem: Omit<Item, 'id'>) => (await axios.post<Item>('http://localhost:3000/todos', newItem)).data,
		onSuccess: () => {
			refreshItems();
			toast.success(t('messages.added'));
		},
		onError: (error) => {
			console.error(error);
			toast.error(t('messages.add_error'));
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string | number) => axios.delete(`http://localhost:3000/todos/${id}`),
		onSuccess: () => {
			refreshItems();
			toast.info(t('messages.deleted'));
		},
		onError: (error) => {
			console.error(error);
			toast.error(t('messages.delete_error'));
		},
	});

	const handleAdd = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const itemTitle = String(form.get('title') ?? '').trim();
		const price = Number(form.get('price'));
		if (!itemTitle || !Number.isFinite(price) || price < 0) {
			toast.warning(t('messages.validation_error'));
			return;
		}
		addMutation.mutate({ title: itemTitle, price });
		event.currentTarget.reset();
	};

	return (
		<section className="max-w-2xl">
			<h2 className="mb-5 text-sm font-medium text-stone-700">{displayTitle}</h2>
			<div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
				{showForm && (
					<form onSubmit={handleAdd} className="mb-8 flex flex-col gap-2 sm:flex-row">
						<input
							name="title"
							required
							placeholder={t('form.title_placeholder')}
							aria-label={t('form.title_aria')}
							className="min-w-0 flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-stone-400 focus:bg-white"
						/>
						<input
							name="price"
							type="number"
							min="0"
							step="0.01"
							required
							placeholder={t('form.price_placeholder')}
							aria-label={t('form.price_aria')}
							className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-stone-400 focus:bg-white sm:w-28"
						/>
						<button
							type="submit"
							disabled={addMutation.isPending}
							className="rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-50"
						>
							{addMutation.isPending ? t('form.submitting') : t('form.submit')}
						</button>
					</form>
				)}

				{isLoading && <p className="py-8 text-center text-sm text-stone-400">{t('messages.loading')}</p>}
				{isError && (
					<p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
						{t('messages.server_error')}
					</p>
				)}
				{!isLoading && !isError && items?.length === 0 && (
					<p className="py-6 text-sm text-stone-400">{t('messages.empty')}</p>
				)}

				<div className="grid gap-2.5">
					{items?.map((item) => (
						<div
							key={item.id}
							onClick={() => setTodosItemId(String(item.id))}
							className={`group flex items-center justify-between rounded-xl border px-4 py-3 transition hover:border-stone-300 cursor-pointer ${
								todosItemId === String(item.id) ? 'border-stone-400 bg-stone-50/50' : 'border-stone-200/80'
							}`}
						>
							<div className="flex items-center gap-3">
								<span className="h-2 w-2 rounded-full bg-stone-300 transition-colors group-hover:bg-emerald-600" />
								<div>
									<h3 className="text-sm font-medium leading-snug text-stone-800">{item.title}</h3>
									<p className="mt-0.5 text-xs text-stone-400">${item.price}</p>
								</div>
							</div>
							<div className="flex items-center gap-1">
								<button
									type="button"
									onClick={(event) => {
										event.stopPropagation();
										setTodosItemId(String(item.id));
										setEditingItem(item);
										setIsModalOpen(true);
									}}
									aria-label={t('aria.edit_item', { title: item.title })}
									className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
								>
									<FaEdit aria-hidden="true" />
								</button>
								<button
									type="button"
									onClick={(event) => {
										event.stopPropagation();
										deleteMutation.mutate(item.id);
									}}
									disabled={deleteMutation.isPending}
									aria-label={t('aria.delete_item', { title: item.title })}
									className="rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
								>
									<FaTrash aria-hidden="true" />
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			<Modal
				isOpen={isModalOpen}
				editingItem={todoDetail ?? editingItem}
				onClose={() => {
					setIsModalOpen(false);
					setEditingItem(null);
				}}
			/>
		</section>
	);
}
