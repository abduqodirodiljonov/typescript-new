import { useState, useEffect, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../types/product';
import { products as initialProducts } from '../../data/products';
import ProductCard from '../../components/ProductCard';

function Catalog() {
  const { t } = useTranslation('catalog');
  const [allData] = useState<Product[]>(initialProducts);

  const [page, setPage] = useState<number>(() => {
    const savedPage = sessionStorage.getItem('catalog_page');
    return savedPage ? Number(savedPage) : 1;
  });

  const [limit, setLimit] = useState<number>(() => {
    const savedLimit = sessionStorage.getItem('catalog_limit');
    return savedLimit ? Number(savedLimit) : 5;
  });

  useEffect(() => {
    sessionStorage.setItem('catalog_page', String(page));
  }, [page]);

  useEffect(() => {
    sessionStorage.setItem('catalog_limit', String(limit));
  }, [limit]);

  const firstIndex: number = (page - 1) * limit;
  const filteredData = allData.slice(firstIndex, firstIndex + limit);

  const handlePageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = +event.currentTarget.value;
    setLimit(value);
    setPage(1);
    sessionStorage.setItem('catalog_page', '1');
  };

  const btnsCount = Math.ceil(allData.length / limit);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-900">{t('title')}</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData.map((item: Product, index: number) => (
          <ProductCard key={item.id} index={index} item={item} />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <label htmlFor="limit-select" className="text-sm text-slate-600">
            {t('show_by')}
          </label>
          <select
            id="limit-select"
            value={limit}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-800 outline-none transition focus:border-slate-500"
            onChange={handlePageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t('prev')}
          </button>

          {Array.from({ length: btnsCount }, (_, i) => i + 1).map((btnNumber) => (
            <button
              key={btnNumber}
              type="button"
              onClick={() => setPage(btnNumber)}
              className={`min-w-9 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                page === btnNumber
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {btnNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(prev + 1, btnsCount))}
            disabled={page === btnsCount}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Catalog;
