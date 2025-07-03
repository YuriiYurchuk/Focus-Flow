import { Loader2, Download } from "lucide-react";

interface ILoadMoreButtonProps {
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

export const LoadMoreButton = ({
  hasMore,
  loadingMore,
  onLoadMore,
}: ILoadMoreButtonProps) => {
  if (!hasMore) return null;

  return (
    <div className="col-span-full flex justify-center pt-6">
      <button
        onClick={onLoadMore}
        disabled={loadingMore}
        aria-disabled={loadingMore}
        tabIndex={loadingMore ? -1 : 0}
        className={`
          relative overflow-hidden py-4 px-6 rounded-2xl font-semibold text-lg text-white shadow-lg 
          flex items-center justify-center gap-2 transition-all duration-300 group
          focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-500
          ${
            loadingMore
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-400/25"
          }
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600 before:via-blue-700 before:to-purple-700 
          before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
        `}
      >
        <span className="relative flex items-center gap-2 z-10">
          {loadingMore ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          )}
          {loadingMore ? "Завантаження..." : "Ще завдання"}
        </span>
        {!loadingMore && (
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
        )}
      </button>
    </div>
  );
};
