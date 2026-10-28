import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { SubmitEvent } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	editingItem: Item | null;
}

interface Item {
	id: string | number;
	title: string;
	price: number;
}

export function Modal({ editingItem, isOpen, onClose }: ModalProps) {
	const { t } = useTranslation('products');
	const queryClient = useQueryClient();

	const updateMutation = useMutation({
		mutationFn: async (updateItem: Item) => {
			const { data } = await axios.put<Item>(`http://localhost:3000/todos/${updateItem.id}`, updateItem);
			return data;
		},
		onSuccess: (data) => {
			queryClient.setQueryData<Item[]>(['items'], (old) =>
				old ? old.map((item) => (String(item.id) === String(data.id) ? data : item)) : []
			);
			queryClient.invalidateQueries({
				queryKey: ['items', String(data.id)],
			});
			toast.success(t('modal.success'));
			onClose();
		},
		onError: (error) => {
			console.error(error);
			toast.error(t('modal.update_fail'));
		},
	});

	if (!isOpen || !editingItem) return null;

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const title = String(form.get('title') ?? '').trim();
		const price = Number(form.get('price'));

		if (!title || !Number.isFinite(price) || price < 0) {
			toast.warning(t('messages.validation_error'));
			return;
		}

		updateMutation.mutate({
			id: editingItem.id,
			title,
			price,
		});
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4 backdrop-blur-sm"
			onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
		>
			<div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl space-y-4">
				<div className="flex items-center justify-between">
					<h2 id="modal-title" className="text-base font-semibold text-stone-900">{t('modal.title')}</h2>
					<button type="button" onClick={onClose} aria-label={t('modal.close')} className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900">
						✕
					</button>
				</div>

				<form key={editingItem.id} onSubmit={handleSubmit} className="space-y-3">
					<input
						name="title"
						defaultValue={editingItem.title}
						type="text"
						placeholder={t('form.title_placeholder')}
						className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-950/5"
					/>
					<input
						name="price"
						defaultValue={editingItem.price}
						type="number"
						placeholder={t('form.price_placeholder')}
						className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-950/5"
					/>

					<button
						type="submit"
						disabled={updateMutation.isPending}
						className="bg-blue-500 hover:bg-blue-600 text-white w-full rounded-xl px-4 py-2.5 text-sm transition disabled:opacity-50"
					>
						{updateMutation.isPending ? t('modal.saving') : t('modal.save')}
					</button>
				</form>
			</div>
		</div>
	);
}
