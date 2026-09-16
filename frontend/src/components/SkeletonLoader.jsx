// Skeleton loader components for placeholder UI with modern pulse/shimmer
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse">
    <div className="skeleton h-52 w-full" />
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="skeleton h-5 w-3/5 rounded-lg" />
        <div className="skeleton h-5 w-12 rounded-lg" />
      </div>
      <div className="skeleton h-3.5 w-4/5 rounded-md" />
      <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
        <div className="skeleton h-3.5 w-1/3 rounded-md" />
        <div className="skeleton h-3.5 w-1/4 rounded-md" />
      </div>
    </div>
  </div>
);

const SkeletonMenuRow = () => (
  <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 py-5 animate-pulse">
    <div className="flex-1 space-y-2.5">
      <div className="skeleton h-4 w-12 rounded-md" />
      <div className="skeleton h-5 w-2/3 rounded-lg" />
      <div className="skeleton h-4 w-1/4 rounded-md" />
      <div className="skeleton h-3.5 w-full rounded-md" />
    </div>
    <div className="skeleton w-28 h-28 sm:w-32 sm:h-32 rounded-2xl shrink-0" />
  </div>
);

const SkeletonOrderCard = () => (
  <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm animate-pulse">
    <div className="flex justify-between items-center">
      <div className="skeleton h-5 w-1/3 rounded-lg" />
      <div className="skeleton h-6 w-24 rounded-full" />
    </div>
    <div className="skeleton h-4 w-1/2 rounded-md" />
    <div className="skeleton h-4 w-2/3 rounded-md" />
    <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
      <div className="skeleton h-4 w-1/4 rounded-md" />
      <div className="skeleton h-9 w-28 rounded-xl" />
    </div>
  </div>
);

const SkeletonDashboardStat = () => (
  <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 space-y-3 shadow-sm animate-pulse">
    <div className="skeleton w-10 h-10 rounded-2xl" />
    <div className="skeleton h-7 w-20 rounded-lg" />
    <div className="skeleton h-3.5 w-28 rounded-md" />
  </div>
);

export { SkeletonCard, SkeletonMenuRow, SkeletonOrderCard, SkeletonDashboardStat };
export default SkeletonCard;
