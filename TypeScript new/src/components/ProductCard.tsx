import { type SyntheticEvent } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import type { Product } from '../types/product';

interface Props {
  product?: Product;
  item?: Product;
  index?: number;
  onDelete?: (id: number) => void;
  onEdit?: (product: Product) => void;
}

function ProductCard({ product: productProp, item, onDelete, onEdit }: Props) {
  const { t } = useTranslation(['catalog', 'common']);
  const product = productProp ?? item;
  if (!product) return null;

  const fallbackText = t('product_fallback');
  let imageUrl = '';
  if (product.images && product.images.length > 0 && product.images[0]?.image) {
    imageUrl = product.images[0].image;
  } else {
    imageUrl = `https://placehold.co/400x240/f3f4f6/9ca3af?text=${encodeURIComponent(product.name || fallbackText)}`;
  }

  const price = (parseFloat(product.price || '0') || 0).toLocaleString('ru-RU');

  function handleImageError(e: SyntheticEvent<HTMLImageElement>) {
    if (!product) return;
    e.currentTarget.src = `https://placehold.co/400x240/f3f4f6/9ca3af?text=${encodeURIComponent(product.name || fallbackText)}`;
  }

  function handleEditClick() {
    if (product && onEdit) {
      onEdit(product);
    }
  }

  function handleDeleteClick() {
    if (product && onDelete) {
      onDelete(product.id);
    }
  }

  return (
    <tr className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Изображение и ID */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <img
            src={imageUrl}
            alt={product.name}
            onError={handleImageError}
            className="h-10 w-10 rounded-lg object-cover border border-gray-200"
          />
          <div>
            <span className="text-xs text-gray-400 block">#{product.id}</span>
            <span className="text-sm font-semibold text-gray-800 line-clamp-1">
              {product.name}
            </span>
          </div>
        </div>
      </td>

      {/* Описание */}
      <td className="px-4 py-3 max-w-xs">
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {product.description}
        </p>
      </td>

      {/* Цена */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-base font-bold text-gray-900">{price} {t('currency', { ns: 'common' })}</span>
      </td>

      {/* Действия (Редактировать / Удалить) */}
      <td className="px-4 py-3 whitespace-nowrap text-right">
        {(onEdit || onDelete) && (
          <div className="flex items-center justify-end gap-2">
            {onEdit && (
              <button
                onClick={handleEditClick}
                className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                title={t('edit')}
              >
                <FiEdit2 size={15} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                title={t('delete')}
              >
                <FiTrash2 size={15} />
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

export default ProductCard;
