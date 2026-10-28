export function LoadingFallback() {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-stone-300 border-t-stone-800" />
        <span className="text-xs font-medium text-stone-500">Загрузка переводов...</span>
      </div>
    </div>
  );
}

export default LoadingFallback;
