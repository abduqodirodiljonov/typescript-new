import { useState, useMemo, type ChangeEvent, type SyntheticEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  FiSearch,
  FiX,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiCopy,
  FiCheck,
  FiEye,
  FiCalendar,
  FiPackage,
  FiArrowUp,
  FiArrowDown,
  FiSliders,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import type { Product } from '../../types/product';
import { products as fallbackProducts } from '../../data/products';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

function TestPage() {
  const { t } = useTranslation(['test', 'common']);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  const [page, setPage] = useState<number>(() => {
    const saved = sessionStorage.getItem('test_page');
    return saved ? Number(saved) : 1;
  });

  const [limit, setLimit] = useState<number>(() => {
    const saved = sessionStorage.getItem('test_limit');
    return saved ? Number(saved) : 10;
  });

  const {
    data: queryData = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<Product[]>({
    queryKey: ['test-products'],
    queryFn: async () => {
      const { data } = await axios.get<Product[]>('http://localhost:5000/products');
      return data;
    },
    retry: 1,
    enabled: !useFallback,
  });

  // If server fails or fallback is enabled, use local fallback products
  const sourceData: Product[] = useFallback || isError ? fallbackProducts : queryData;

  // Search & Sorting filter
  const processedData = useMemo(() => {
    let result = [...sourceData];

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query)) ||
          String(item.id).includes(query)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name, 'ru'));
    }

    return result;
  }, [sourceData, searchTerm, sortBy]);

  const totalItems = processedData.length;
  const btnsCount = Math.max(1, Math.ceil(totalItems / limit));
  const safePage = Math.min(page, btnsCount);
  const firstIndex = (safePage - 1) * limit;
  const filteredData = processedData.slice(firstIndex, firstIndex + limit);
  const rangeStart = totalItems ? firstIndex + 1 : 0;
  const rangeEnd = Math.min(firstIndex + limit, totalItems);

  // Statistics
  const avgPrice = useMemo(() => {
    if (!sourceData.length) return 0;
    const sum = sourceData.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    return Math.round(sum / sourceData.length);
  }, [sourceData]);

  const handleLimitChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.currentTarget.value);
    setLimit(value);
    setPage(1);
    sessionStorage.setItem('test_limit', String(value));
    sessionStorage.setItem('test_page', '1');
  };

  const handlePageSelect = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, btnsCount));
    setPage(validPage);
    sessionStorage.setItem('test_page', String(validPage));
  };

  const handleCopyId = (id: number) => {
    navigator.clipboard.writeText(String(id));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('default');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-900/5 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Banner / Header */}
        <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-10 right-1/3 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                <FiPackage className="text-indigo-400" />
                <span>{t('badge')}</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {t('title')}
              </h1>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                {t('subtitle')}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <span className="block text-xs font-medium uppercase tracking-wider text-slate-400">{t('stats.total_items')}</span>
                <span className="mt-1 block text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {sourceData.length}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <span className="block text-xs font-medium uppercase tracking-wider text-slate-400">{t('stats.avg_price')}</span>
                <span className="mt-1 block text-2xl font-bold tracking-tight text-indigo-200 sm:text-3xl">
                  {avgPrice.toLocaleString('ru-RU')} <span className="text-base font-normal text-slate-300">{t('currency', { ns: 'common' })}</span>
                </span>
              </div>

              <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:col-span-1">
                <span className="block text-xs font-medium uppercase tracking-wider text-slate-400">{t('stats.source')}</span>
                <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {useFallback ? t('stats.source_fallback') : isError ? t('stats.source_demo') : t('stats.source_api')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Server offline notice with seamless fallback button */}
        {isError && !useFallback && (
          <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <FiAlertCircle size={20} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-amber-900">
                  {t('server_offline.title')}
                </h2>
                <p className="text-xs text-amber-700">
                  {t('server_offline.desc_prefix')} <code className="rounded bg-amber-200/60 px-1 py-0.5 font-mono">npm run server:test</code> {t('server_offline.desc_suffix')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUseFallback(true)}
                className="cursor-pointer rounded-xl bg-amber-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-800"
              >
                {t('server_offline.show_demo')}
              </button>
              <button
                type="button"
                onClick={() => refetch()}
                className="cursor-pointer rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-medium text-amber-800 transition hover:bg-amber-50"
              >
                {t('server_offline.retry')}
              </button>
            </div>
          </div>
        )}

        {/* Toolbar: Search, Sort, Reload */}
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder={t('search.placeholder')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-9 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                title={t('search.clear')}
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Controls: Sorting & Refresh */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-xs font-medium text-slate-600">
              <FiSliders className="text-slate-400" size={14} />
              <span>{t('sort.label')}</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setPage(1);
                }}
                className="cursor-pointer bg-transparent font-semibold text-slate-800 outline-none"
              >
                <option value="default">{t('sort.default')}</option>
                <option value="price-asc">{t('sort.price_asc')}</option>
                <option value="price-desc">{t('sort.price_desc')}</option>
                <option value="name-asc">{t('sort.name_asc')}</option>
                <option value="name-desc">{t('sort.name_desc')}</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching || isLoading}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
              title={t('refresh_title')}
            >
              <FiRefreshCw className={isFetching ? 'animate-spin text-indigo-600' : 'text-slate-500'} size={14} />
              <span className="hidden sm:inline">{t('refresh')}</span>
            </button>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_10px_30px_-15px_rgba(15,23,42,0.08)]">
          {isLoading ? (
            /* Skeleton Loading State */
            <div className="p-6">
              <div className="flex items-center justify-between pb-4">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
              </div>
              <div className="divide-y divide-slate-100">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-4">
                    <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-slate-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                    </div>
                    <div className="h-5 w-20 animate-pulse rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          ) : totalItems === 0 ? (
            /* Empty state */
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                <FiPackage size={28} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{t('empty.title')}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {t('empty.desc', { query: searchTerm })}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700"
              >
                {t('empty.reset')}
              </button>
            </div>
          ) : (
            /* Table Data */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th scope="col" className="w-20 px-5 py-4">{t('table.id')}</th>
                    <th scope="col" className="px-5 py-4">{t('table.product')}</th>
                    <th scope="col" className="px-5 py-4">{t('table.description')}</th>
                    <th scope="col" className="w-36 px-5 py-4">{t('table.date')}</th>
                    <th scope="col" className="w-32 px-5 py-4">{t('table.status')}</th>
                    <th
                      scope="col"
                      onClick={() => {
                        setSortBy((prev) => (prev === 'price-asc' ? 'price-desc' : 'price-asc'));
                        setPage(1);
                      }}
                      className="w-36 cursor-pointer px-5 py-4 text-right transition hover:text-indigo-600"
                      title={t('table.price_sort_title')}
                    >
                      <div className="inline-flex items-center gap-1">
                        <span>{t('table.price')}</span>
                        {sortBy === 'price-asc' ? (
                          <FiArrowUp className="text-indigo-600" size={13} />
                        ) : sortBy === 'price-desc' ? (
                          <FiArrowDown className="text-indigo-600" size={13} />
                        ) : null}
                      </div>
                    </th>
                    <th scope="col" className="w-24 px-5 py-4 text-center">{t('table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredData.map((item) => {
                    const priceFormatted = (Number(item.price) || 0).toLocaleString('ru-RU');
                    const hasImage = item.images && item.images.length > 0 && Boolean(item.images[0]?.image);
                    const imageSrc = hasImage
                      ? item.images[0].image
                      : `https://placehold.co/100x100/f1f5f9/64748b?text=${item.id}`;

                    const dateFormatted = item.created_at
                      ? new Date(item.created_at).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—';

                    return (
                      <tr
                        key={item.id}
                        className="group transition-colors odd:bg-white even:bg-slate-50/40 hover:bg-indigo-50/40"
                      >
                        {/* ID Badge */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => handleCopyId(item.id)}
                            className="group/btn inline-flex items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-100/70 px-2 py-1 font-mono text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                            title={t('table.copy_id')}
                          >
                            <span>#{item.id}</span>
                            {copiedId === item.id ? (
                              <FiCheck className="text-emerald-600" size={12} />
                            ) : (
                              <FiCopy className="opacity-0 transition-opacity group-hover/btn:opacity-100" size={11} />
                            )}
                          </button>
                        </td>

                        {/* Product Info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-xs">
                              <img
                                src={imageSrc}
                                alt={item.name}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                                onError={(e: SyntheticEvent<HTMLImageElement>) => {
                                  e.currentTarget.src = `https://placehold.co/100x100/f1f5f9/64748b?text=${item.id}`;
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                {item.name}
                              </p>
                              <span className="inline-block mt-0.5 text-xs text-slate-400">
                                SKU-{1000 + item.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="max-w-xs px-5 py-4">
                          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                            {item.description || t('table.no_description')}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <FiCalendar className="text-slate-400" size={13} />
                            <span>{dateFormatted}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            {t('table.in_stock')}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <span className="inline-block rounded-lg bg-slate-100/80 px-2.5 py-1 font-mono text-sm font-bold text-slate-900 group-hover:bg-indigo-100/70 group-hover:text-indigo-900 transition-colors">
                            {priceFormatted} {t('currency', { ns: 'common' })}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="whitespace-nowrap px-5 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedProduct(item)}
                            className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
                            title={t('table.quick_view')}
                          >
                            <FiEye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer with Pagination & Range Info */}
          {!isLoading && totalItems > 0 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 bg-slate-50/50 px-5 py-4 sm:flex-row">
              {/* Range & Per Page select */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600">
                <span>
                  {t('pagination.showing')} <strong className="font-semibold text-slate-800">{rangeStart}–{rangeEnd}</strong> {t('pagination.of')}{' '}
                  <strong className="font-semibold text-slate-800">{totalItems}</strong> {t('pagination.products')}
                </span>

                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                  <label htmlFor="limit-select" className="text-slate-500">{t('pagination.on_page')}</label>
                  <select
                    id="limit-select"
                    value={limit}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 shadow-2xs outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    onChange={handleLimitChange}
                  >
                    {[5, 10, 15, 20, 50].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pagination controls */}
              <nav aria-label={t('pagination.aria_label')} className="flex items-center gap-1">
                {/* First page button */}
                <button
                  type="button"
                  onClick={() => handlePageSelect(1)}
                  disabled={safePage === 1}
                  className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                  title={t('pagination.first')}
                >
                  <FiChevronsLeft size={15} />
                </button>

                {/* Previous button */}
                <button
                  type="button"
                  onClick={() => handlePageSelect(safePage - 1)}
                  disabled={safePage === 1}
                  className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                  title={t('pagination.prev')}
                >
                  <FiChevronLeft size={15} />
                </button>

                {/* Page number buttons */}
                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: btnsCount }, (_, i) => i + 1)
                    .filter((btn) => {
                      if (btnsCount <= 7) return true;
                      if (btn === 1 || btn === btnsCount) return true;
                      return Math.abs(btn - safePage) <= 1;
                    })
                    .map((btnNumber, idx, arr) => {
                      const prevBtn = arr[idx - 1];
                      const showEllipsis = prevBtn && btnNumber - prevBtn > 1;

                      return (
                        <div key={btnNumber} className="flex items-center">
                          {showEllipsis && <span className="px-1 text-xs text-slate-400">…</span>}
                          <button
                            type="button"
                            onClick={() => handlePageSelect(btnNumber)}
                            aria-current={safePage === btnNumber ? 'page' : undefined}
                            className={`cursor-pointer h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition ${
                              safePage === btnNumber
                                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {btnNumber}
                          </button>
                        </div>
                      );
                    })}
                </div>

                {/* Next button */}
                <button
                  type="button"
                  onClick={() => handlePageSelect(safePage + 1)}
                  disabled={safePage === btnsCount}
                  className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                  title={t('pagination.next')}
                >
                  <FiChevronRight size={15} />
                </button>

                {/* Last page button */}
                <button
                  type="button"
                  onClick={() => handlePageSelect(btnsCount)}
                  disabled={safePage === btnsCount}
                  className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                  title={t('pagination.last')}
                >
                  <FiChevronsRight size={15} />
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* Quick View Modal */}
        {selectedProduct && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="cursor-pointer absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                title={t('quick_view.close')}
              >
                <FiX size={18} />
              </button>

              <div className="flex gap-4">
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <img
                    src={
                      selectedProduct.images && selectedProduct.images.length > 0 && selectedProduct.images[0]?.image
                        ? selectedProduct.images[0].image
                        : `https://placehold.co/200x200/f1f5f9/64748b?text=${selectedProduct.id}`
                    }
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-mono text-xs font-semibold text-indigo-700">
                      #{selectedProduct.id}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                      <FiCheckCircle size={13} />
                      {t('quick_view.in_stock')}
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-slate-900 line-clamp-2">
                    {selectedProduct.name}
                  </h3>
                  <p className="mt-2 text-2xl font-extrabold text-indigo-600">
                    {(Number(selectedProduct.price) || 0).toLocaleString('ru-RU')} {t('currency', { ns: 'common' })}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('quick_view.description_heading')}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {selectedProduct.description || t('quick_view.no_description')}
                </p>
              </div>

              {selectedProduct.created_at && (
                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">
                  <span>{t('quick_view.added_at')}</span>
                  <span className="font-medium text-slate-700">
                    {new Date(selectedProduct.created_at).toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="cursor-pointer rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
                >
                  {t('quick_view.close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestPage;
