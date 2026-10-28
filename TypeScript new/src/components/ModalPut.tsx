import { useState, type ChangeEvent, type FormEvent, type MouseEvent } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import type { Product } from '../types/product';
import { useUpdateProductMutation } from '../types/productApi';

interface Props {
  product: Product;
  onClose: () => void;
}

function ModalPut({ product, onClose }: Props) {
  const { t } = useTranslation('products');
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
  });

  const [updateProduct, { isLoading, isError }] = useUpdateProductMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.currentTarget.name]: e.currentTarget.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateProduct({ id: product.id, patch: form }).unwrap();
      toast.success(t('modal.product_updated'));
      onClose();
    } catch {
      toast.error(t('modal.update_fail'));
    }
  };

  const handleModalClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6"
        onClick={handleModalClick}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">{t('modal.title')}</h2>
          <button onClick={onClose} aria-label={t('modal.close')} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">{t('modal.name_label')}</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">{t('modal.price_label')}</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">{t('modal.description_label')}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
            />
          </div>

          {isError && <p className="text-xs text-red-400">{t('modal.update_error')}</p>}

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {t('modal.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? t('modal.saving') : t('modal.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalPut;
